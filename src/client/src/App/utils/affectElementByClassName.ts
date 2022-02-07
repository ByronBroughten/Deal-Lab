export default function affectElementByClassName(className: string) {
  // inputRef.current.focus();
  const inputRef: HTMLInputElement = document.getElementsByClassName(
    className
  )[0] as HTMLInputElement;

  inputRef.focus();
  inputRef.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "e",
      keyCode: 69,
      // code: "KeyE",
      bubbles: true,
    })
  );
  inputRef.dispatchEvent(
    new KeyboardEvent("keypress", {
      key: "e",
      keyCode: 69,
      // code: "KeyE",
      bubbles: true,
    })
  );
  inputRef.value = inputRef.value + "e";
  inputRef.dispatchEvent(new Event("change", { bubbles: true }));
  inputRef.dispatchEvent(
    new Event("input", { bubbles: true, cancelable: true })
  );
  inputRef.dispatchEvent(
    new KeyboardEvent("keyup", {
      key: "e",
      keyCode: 69,
      code: "KeyE",
      bubbles: true,
      //@ts-ignore
      // which: 69,
      // shiftKey: false,
      // ctrlKey: false,
      // metaKey: false,
    })
  );
}
