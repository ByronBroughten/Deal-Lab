import { toast } from "react-toastify";

export function toastNotice(text: string) {
  toast.warning(text, {
    position: "top-center",
  });
}
