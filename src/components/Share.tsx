import { useState } from "react";
import { auth, db } from "../config/fireBase";
import {
  arrayUnion,
  collection,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  doc,
} from "firebase/firestore";

interface Props {
  setAlert: (message: string, type: "success" | "danger") => void;
  task: { id: string; text: string };
  setShare: (share: boolean) => void;
}

function Share({ task, setShare, setAlert }: Props) {
  const [shareWith, setShareWith] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onShare = async (id: string) => {
    const copyRef = collection(db, `${auth?.currentUser?.email}`, id, task.text);
    const pastRef1 = doc(db, `${auth?.currentUser?.email}`, "shared-from-you");
    const pastRef2 = doc(db, shareWith, "shared-with-you");

    const today = new Date();
    const newId = today.getTime().toString();

    const snapCopy = await getDocs(copyRef);
    const snapPast1 = await getDoc(pastRef1);
    const snapPast2 = await getDoc(pastRef2);

    const targetRef1 = collection(pastRef1, shareWith);
    const q = query(
      targetRef1,
      where("text", ">=", task.text),
      where("text", "<=", task.text + "\uf8ff")
    );
    const existingSnap = await getDocs(q);

    let finalText = task.text;
    let counter = 1;

    while (existingSnap.docs.some((d) => d.data().text === finalText)) {
      finalText = `${task.text}${counter}`;
      counter++;
    }

    for (const d of snapCopy.docs) {
      await setDoc(doc(pastRef1, shareWith, newId, finalText, d.id), d.data());
      await setDoc(
        doc(pastRef2, `${auth?.currentUser?.email}`, newId, finalText, d.id),
        d.data()
      );
    }

    if (!snapPast1.exists()) {
      await setDoc(pastRef1, { collections: arrayUnion(shareWith) });
    } else {
      await updateDoc(pastRef1, { collections: arrayUnion(shareWith) });
    }

    if (!snapPast2.exists()) {
      await setDoc(pastRef2, {
        unreaded: 1,
        collections: arrayUnion(`${auth?.currentUser?.email}`),
      });
    } else {
      await updateDoc(pastRef2, {
        collections: arrayUnion(`${auth?.currentUser?.email}`),
      });
      const num = snapPast2.data().unreaded;
      await updateDoc(pastRef2, {
        unreaded: num === undefined ? 1 : num+1,
      });
    }

    const pastDoc1 = doc(pastRef1, shareWith, newId);
    await setDoc(pastDoc1, { text: finalText });

    const pastDoc2 = doc(pastRef2, `${auth?.currentUser?.email}`, newId);
    await setDoc(pastDoc2, { text: finalText });
  };

  const handleShare = async () => {
    if (!emailRegex.test(shareWith)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await onShare(task.id);
      setAlert( `"${task.text}" shared successfully!`, "success");
      setShareWith("");
      setShare(false);
    } catch (err) {
      console.error(err);
      setAlert( "Failed to share task. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="mx-1 d-flex"
        style={{
          backgroundColor: "#a644d377",
          justifyContent: "space-between",
          padding: "6px 3px",
          alignItems: "flex-end",
        }}
      >
        <div>
          <label className="mx-1 mb-1">Share "{task.text}" with:</label>
          <input
            className="form-control"
            type="email"
            placeholder="email address..."
            style={{ borderRadius: "8px" }}
            value={shareWith}
            onChange={(e) => setShareWith(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleShare();
              if (e.key === "Escape") setShareWith("");
            }}
            autoFocus
          />
          {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
        <button
          className="btn btn-sm btn-success"
          style={{ height: "fit-content", minWidth: "70px" }}
          onClick={handleShare}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : (
            "Share"
          )}
        </button>
      </div>
    </>
  );
}

export default Share;
