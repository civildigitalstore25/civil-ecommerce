type ContactFormSubmitRowProps = {
  isPending: boolean;
};

export function ContactFormSubmitRow({ isPending }: ContactFormSubmitRowProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-semibold transition hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 text-base"
      style={{
        background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
        color: "#fff",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {isPending ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
            style={{
              borderColor: "#fff",
              borderTopColor: "transparent",
            }}
          />
          Sending...
        </>
      ) : (
        "SUBMIT MESSAGE"
      )}
    </button>
  );
}
