import { auth, db } from "../config/fireBase";
import { useEffect, useState } from "react";
import SignOut from "./SignOut";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

interface Props {
  setFilter: (filter: "all" | "active" | "completed") => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setBackHeader: (backHeader: string) => void;
  setBlockIndex: (blockIndex: string) => void;
  filter: "all" | "active" | "completed";
  setHeader: (header: string) => void;
  setShare: (share: string) => void;
  getTasks: () => void;
  backHeader: string;
  header: string;
  count: number;
}

function Footer({
  setIsAuthenticated,
  setBlockIndex,
  setBackHeader,
  backHeader,
  setHeader,
  setFilter,
  getTasks,
  setShare,
  header,
  filter,
  count,
}: Props) {
  const [clicked, setClicked] = useState(false);
  const [unreaded, setUnreader] = useState(0);

  const checkNew = async () => {
    const shareRef = doc(db, `${auth?.currentUser?.email}`, "shared-with-you");
    const data = await getDoc(shareRef);
    const snapData = data.data();
    if (
      snapData &&
      snapData.unreaded !== 0 &&
      snapData.unreaded !== undefined
    ) {
      if (clicked) {
        await updateDoc(shareRef, { unreaded: 0 });
        setUnreader(0);
      } else {
        setUnreader(snapData.unreaded);
      }
    } else {
      setUnreader(0);
    }
  };

  useEffect(() => {
    checkNew();
  });

  return (
    <div className="bg-light border-top py-2 fixed-bottom px-2">
      {header === "Task Notes" ? (
        <div className="d-flex justify-content-between align-items-center">
          <button
            style={{ fontWeight: "bold", backgroundColor: "#ab0fda" }}
            className="btn btn-sm mb-1"
            onClick={() => {
              setBlockIndex("block2");
              setHeader("Trash");
              setShare("trash/trash/trash");
            }}
          >
            <img src="/trash.png" alt="me" width="30" height="30" />
          </button>
          <div className="pb-1 d-flex" style={{ flexDirection: "column" }}>
            <div className="position-relative d-inline-block">
              <button
                type="button"
                style={{ fontWeight: "bold", backgroundColor: "#ab0fda" }}
                className="btn position-relative btn-sm text-white mb-1"
                onClick={() => {
                  setHeader("Task groups shared with you");
                  setShare("shared-with-you");
                  setClicked(true);
                }}
              >
                Task groups shared with you
                {unreaded !== 0 && (
                  <span
                    className="position-absolute top-0 start-0 translate-middle badge rounded-pill"
                    style={{ backgroundColor: "#14c717ff" }}
                  >
                    {unreaded}
                  </span>
                )}
              </button>
            </div>
            <button
              style={{ fontWeight: "bold", backgroundColor: "#ab0fda" }}
              className="btn btn-sm mb-1 text-white"
              onClick={() => {
                setHeader("Task groups you shared");
                setShare("shared-from-you");
              }}
            >
              Task groups you shared
            </button>
          </div>
        </div>
      ) : header === "Task groups shared with you" ? (
        <button
          style={{ fontWeight: "bold" }}
          className="btn btn-sm btn-primary mb-1"
          onClick={() => {
            setBlockIndex("block3w");
            setHeader("Trash of groups shared with you");
            setShare("trash/trash/shared-with-you");
          }}
        >
          <img src="/trash.png" alt="me" width="30" height="30" />
        </button>
      ) : header === "Task groups you shared" ? (
        <button
          style={{ fontWeight: "bold" }}
          className="btn btn-sm btn-primary mb-1"
          onClick={() => {
            setBlockIndex("block3f");
            setHeader("Trash of groups you shared");
            setShare("trash/trash/shared-from-you");
          }}
        >
          <img src="/trash.png" alt="me" width="30" height="30" />
        </button>
      ) : header === "Trash" ? (
        ""
      ) : header === "Trash of groups shared with you" ? (
        ""
      ) : header === "Trash of groups you shared" ? (
        ""
      ) : header === "Trash of tasks" ? (
        ""
      ) : (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {header !== "Trash of tasks" &&
              backHeader !== "Trash of groups shared with you" &&
              backHeader !== "Trash of groups you shared" &&
              backHeader !== "Trash" &&
              backHeader !== "Task groups shared with you" &&
              backHeader !== "Task groups you shared" && (
                <button
                  style={{ fontWeight: "bold" }}
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => {
                    setBlockIndex("block2");
                    setBackHeader(header);
                    setHeader("Trash of tasks");
                  }}
                >
                  <img src="/trash.png" alt="me" width="30" height="30" />
                </button>
              )}
            {count === 1 ? (
              filter === "completed" ? (
                <span>{count} task completed</span>
              ) : filter === "all" ? (
                <span>{count} task</span>
              ) : (
                <span>{count} task left</span>
              )
            ) : filter === "completed" ? (
              <span>{count} tasks completed</span>
            ) : filter === "all" ? (
              <span>{count} tasks</span>
            ) : (
              <span>{count} tasks left</span>
            )}
          </div>
          <div className="btn-group">
            <button
              className={`btn btn-sm ${
                filter === "all" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setFilter("all");
                getTasks();
              }}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${
                filter === "active" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setFilter("active");
                getTasks();
              }}
            >
              Active
            </button>
            <button
              className={`btn btn-sm ${
                filter === "completed" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setFilter("completed");
                getTasks();
              }}
            >
              Completed
            </button>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center">
        <span className="small">© 2025 Najib Abdelilah</span>
        <SignOut setIsAuthenticated={setIsAuthenticated} header={header} />
      </div>
    </div>
  );
}

export default Footer;
