import { toast } from "react-toastify";

export function toastNotice(text: string) {
  toast.warning(text, {
    position: "top-center",
  });
}

export function showToastInfo(warningText: string) {
  toast.info(warningText, {
    position: "top-center",
  });
}

export function toastLoginNotice(toWhat?: string): void {
  toastNotice(`To ${toWhat}, please login.`);
}
