import { useState } from "react";

export default function useFullscreenModal() {
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  return { showModal, showWarning, setShowWarning, openModal, closeModal };
}
