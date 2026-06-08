import mongoose from "mongoose";
import User from "../models/User";
import Blog from "../models/Blog";

type BlogLike = {
  _id?: mongoose.Types.ObjectId | string;
  authorId?: mongoose.Types.ObjectId | string;
  author?: string;
  authorAvatarUrl?: string;
  toObject?: () => BlogLike;
};

function toPlainBlog(blog: unknown): BlogLike {
  if (
    blog &&
    typeof blog === "object" &&
    typeof (blog as BlogLike).toObject === "function"
  ) {
    return (blog as BlogLike).toObject!();
  }
  return { ...(blog as BlogLike) };
}

/** Legacy posts may store author text without authorId (e.g. "Admin"). */
const LEGACY_GENERIC_AUTHOR_NAMES = new Set(["admin", "civil digital store"]);

function isLegacyGenericAuthorName(name?: string): boolean {
  const normalized = name?.trim().toLowerCase() ?? "";
  return LEGACY_GENERIC_AUTHOR_NAMES.has(normalized);
}

async function resolveOrphanBlogAuthor(authorName?: string) {
  const trimmed = authorName?.trim();
  if (!trimmed) return null;

  if (trimmed.toLowerCase() === "admin") {
    const superadmin = await User.findOne({ role: "superadmin" })
      .sort({ updatedAt: -1 })
      .select("fullName avatarUrl")
      .lean();
    if (superadmin) return superadmin;

    return User.findOne({ role: "admin" })
      .sort({ updatedAt: -1 })
      .select("fullName avatarUrl")
      .lean();
  }

  if (isLegacyGenericAuthorName(trimmed)) return null;

  return User.findOne({
    $or: [{ fullName: trimmed }, { email: trimmed }],
  })
    .select("fullName avatarUrl")
    .lean();
}

async function relinkMislinkedLegacyAuthor(
  plain: BlogLike,
  authorId: mongoose.Types.ObjectId | string,
): Promise<mongoose.Types.ObjectId | string> {
  if (!isLegacyGenericAuthorName(plain.author)) return authorId;

  const current = await loadAuthorProfile(authorId);
  if (!current || !isLegacyGenericAuthorName(current.fullName)) return authorId;

  const linked = await resolveOrphanBlogAuthor(plain.author);
  if (!linked?._id || linked._id.toString() === authorId.toString()) return authorId;

  if (plain._id) {
    await Blog.updateOne(
      { _id: plain._id },
      { $set: { authorId: linked._id, author: linked.fullName } },
    );
  }

  return linked._id as mongoose.Types.ObjectId;
}

async function loadAuthorProfile(authorId: mongoose.Types.ObjectId | string) {
  return User.findById(authorId).select("fullName avatarUrl").lean();
}

/** Replace stale blog.author with the linked user's current profile. */
export async function enrichBlogWithAuthorProfile<T>(blog: T): Promise<T> {
  const plain = toPlainBlog(blog) as BlogLike & T;
  let authorId = plain.authorId;

  if (!authorId) {
    const linked = await resolveOrphanBlogAuthor(plain.author);
    if (linked?._id) {
      authorId = linked._id as mongoose.Types.ObjectId;
      if (plain._id) {
        await Blog.updateOne(
          { _id: plain._id },
          { $set: { authorId: linked._id, author: linked.fullName } },
        );
      }
    }
  } else {
    authorId = await relinkMislinkedLegacyAuthor(plain, authorId);
  }

  if (!authorId) {
    return plain as T;
  }

  const author = await loadAuthorProfile(authorId);
  if (!author) return plain as T;

  const result = {
    ...plain,
    authorId,
    author: author.fullName || plain.author,
    authorAvatarUrl: author.avatarUrl || undefined,
  } as T;

  return result;
}

export async function enrichBlogsWithAuthorProfiles<T>(blogs: T[]): Promise<T[]> {
  if (!blogs.length) return blogs;

  const plainBlogs = blogs.map((b) => toPlainBlog(b) as BlogLike & T);

  for (let i = 0; i < plainBlogs.length; i += 1) {
    if (!plainBlogs[i].authorId) {
      const linked = await resolveOrphanBlogAuthor(plainBlogs[i].author);
      if (linked?._id) {
        plainBlogs[i] = {
          ...plainBlogs[i],
          authorId: linked._id,
          author: linked.fullName,
        };
        if (plainBlogs[i]._id) {
          await Blog.updateOne(
            { _id: plainBlogs[i]._id },
            { $set: { authorId: linked._id, author: linked.fullName } },
          );
        }
      }
    } else {
      const relinkedId = await relinkMislinkedLegacyAuthor(
        plainBlogs[i],
        plainBlogs[i].authorId!,
      );
      if (relinkedId.toString() !== plainBlogs[i].authorId?.toString()) {
        const linked = await loadAuthorProfile(relinkedId);
        plainBlogs[i] = {
          ...plainBlogs[i],
          authorId: relinkedId,
          author: linked?.fullName || plainBlogs[i].author,
        };
      }
    }
  }

  const authorIds = [
    ...new Set(
      plainBlogs
        .map((b) => b.authorId?.toString())
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  if (!authorIds.length) return plainBlogs as T[];

  const authors = await User.find({ _id: { $in: authorIds } })
    .select("fullName avatarUrl")
    .lean();

  const authorMap = new Map(authors.map((a) => [a._id.toString(), a]));

  return plainBlogs.map((plain) => {
    const id = plain.authorId?.toString();
    if (!id) return plain as T;
    const author = authorMap.get(id);
    if (!author) return plain as T;
    return {
      ...plain,
      author: author.fullName || plain.author,
      authorAvatarUrl: author.avatarUrl || undefined,
    } as T;
  });
}

/** Always stamp author from the authenticated editor (ignore client author text). */
export async function stampBlogAuthorFromUser(
  blogData: Record<string, unknown>,
  user: { _id: unknown; fullName?: string; email?: string },
): Promise<void> {
  blogData.authorId = user._id;
  const authorUser = await User.findById(user._id).select("fullName avatarUrl").lean();
  blogData.author = authorUser?.fullName || user.fullName || user.email;
}
