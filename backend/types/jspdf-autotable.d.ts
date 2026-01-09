declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  interface UserOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    margin?: any;
    theme?: "striped" | "grid" | "plain";
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    styles?: any;
    columnStyles?: any;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): void;
}
