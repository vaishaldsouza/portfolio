"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import styles from "./mailForm.module.scss";
import emailjs from "@emailjs/browser";

const Prompt = ({ status, errorMessage }) => {
  const [showGif, setShowGif] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowGif(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.prompt}>
      {showGif ? (
        <Image src="/windowsIcons/mail.gif" alt="sending" className={styles.sendingGif} width={90} height={90} />
      ) : status ? (
        <div>
          <div className={styles.promptHead}>
            <Image src="/windowsIcons/msg_success.png" alt="success" className={styles.promptImg} height={40} width={40} />
            <h3>Message delivered! 🎉</h3>
          </div>
          <p className={styles.successCode}>Prajwal will get back to you soon. Connect on LinkedIn too!</p>
        </div>
      ) : (
        <div>
          <div className={styles.promptHead}>
            <Image src="/windowsIcons/msg_error.png" alt="error" className={styles.promptImg} height={40} width={40} />
            <h2>Mail not delivered</h2>
          </div>
          <p className={styles.errorCode}>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

const MailForm = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [status, setStatus] = useState();
  const [errorMessage, setErrorMessage] = useState("Something went wrong. Try emailing directly: prajwala27112005@gmail.com");
  const form = useRef();

  const handleSend = (e) => {
    e.preventDefault();
    setShowPrompt(true);
    emailjs.sendForm(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      form.current,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    )
      .then(
        (result) => { setStatus(true); form.current.reset(); },
        (error) => { setStatus(false); setErrorMessage(error.text); }
      );
    const t = setTimeout(() => setShowPrompt(false), 6000);
    return () => clearTimeout(t);
  };

  return (
    <>
      <form ref={form} className={styles.form} onSubmit={handleSend}>
        <div className={styles.welcome}>
          <h2>Hey there! 👋</h2>
          <div className={styles.action}>
            <button type="submit" className={styles.action}>
              <Image src="/windowsIcons/send.png" alt="send" width={30} height={30} />
              <span>Send</span>
            </button>
          </div>
        </div>
        <div className={styles.formElement}>
          <label htmlFor="from">From</label>
          <input type="email" name="from" id="from" required placeholder="your@email.com" />
        </div>
        <div className={styles.formElement}>
          <label htmlFor="to">To</label>
          <input type="email" id="to" className={styles.to} placeholder="prajwala27112005@gmail.com" disabled />
        </div>
        <div className={styles.formElement}>
          <label htmlFor="subject"></label>
          <input type="text" name="subject" id="subject" placeholder="Subject" />
        </div>
        <textarea className={styles.message} name="message" placeholder={`Write nice words like: "You're hired! 🤝"`} required></textarea>
      </form>
      {showPrompt && <Prompt status={status} errorMessage={errorMessage} />}
    </>
  );
};

export default MailForm;
