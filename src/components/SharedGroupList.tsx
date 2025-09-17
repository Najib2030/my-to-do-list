import SharedGroupItem from "./SharedGroupItem";
import { db, auth } from "../config/fireBase";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

interface Props {
  setSubCollection: (subCollection: string) => void;
  setBackHeader: (header: string) => void;
  setHeader: (header: string) => void;
  setIdClicked: (id: string) => void;
  subCollection: string;
  header: string;
  share: string;
}

function SharedGroupList({
  share,
  header,
  setHeader,
  setIdClicked,
  setBackHeader,
  subCollection,
  setSubCollection,
}: Props) {
  const [allSharedTasksGroups, setAllSharedTasksGroups] = useState<any[][]>([]);
  const [subCollections, setSubCollections] = useState<string[]>([]);
  const [globalAlert, setGlobalAlertState] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  const setGlobalAlert = (message: string, type: "success" | "danger") => {
    setGlobalAlertState({ message, type });
    setTimeout(() => setGlobalAlertState(null), 4000);
  };

  const sharedTasksGroupCollectionRef = doc(
    db,
    `${auth?.currentUser?.email}`,
    share
  );

  const getSubCollections = async () => {
    const coll = await getDoc(sharedTasksGroupCollectionRef);
    if (coll.exists()) {
      const firestoreCollections = coll.data().collections || [];
      setSubCollections(firestoreCollections);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getSubCollections();
  }, []);

  const getAllSharedTasksGroups = async () => {
    if (subCollections.length === 0) return null;

    const groups = await Promise.all(
      subCollections.map(async (subCol) => {
        const data = await getDocs(
          collection(sharedTasksGroupCollectionRef, subCol)
        );
        return data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
      })
    );

    setAllSharedTasksGroups(groups);
  };

  useEffect(() => {
    getAllSharedTasksGroups();
  }, [subCollections]);

  if (allSharedTasksGroups.length === 0) {
    return share === "shared-with-you" ? (
      <div className="alert alert-info text-center">
        No one has shared anything with you yet.
      </div>
    ) : share === "shared-from-you" ? (
      <div className="alert alert-info text-center">
        You haven't shared anything with anyone yet.
      </div>
    ) : null;
  }

  return (
    <div style={{ paddingBottom: "90px" }}>
      {globalAlert && (
        <div
          className={`alert alert-${globalAlert.type} text-center`}
          role="alert"
          style={{
            position: "fixed",
            top: "10px",
            right: "0",
            transform: globalAlert ? "translateX(0)" : "translateX(120%)",
            transition: "transform 2.5s ease, opacity 2.5s ease",
            opacity: globalAlert ? 1 : 0,
            zIndex: 2000,
            width: "auto",
            maxWidth: "90%",
            borderRadius: "25px 0 0 25px",
          }}
        >
          {globalAlert.message}
        </div>
      )}

      {allSharedTasksGroups.map((tasks, index) => (
        <>
          {allSharedTasksGroups[index].length === 0 ? (
            ""
          ) : (
            <div className="alert alert-primary">{subCollections[index]}</div>
          )}

          <ul
            className="list-group mb-3"
            key={`${index}-${subCollection}`}
          >
            {tasks.map((task) => (
              <SharedGroupItem
                key={`${index}-${task.id}`}
                task={task}
                setAllSharedTasksGroups={setAllSharedTasksGroups}
                allSharedTasksGroups={allSharedTasksGroups}
                setHeader={setHeader}
                setBackHeader={setBackHeader}
                setIdClicked={setIdClicked}
                header={header}
                setSubCollection={setSubCollection}
                subCollection={subCollections[index]}
                shareCollection={share}
                collectionIndex={index}
                setGlobalAlert={setGlobalAlert}
              />
            ))}
          </ul>
        </>
      ))}
      <sub
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "10px",
          color: "#6c757d",
          fontSize: "14px",
        }}
      >
        click on a title to view the tasks.
      </sub>
    </div>
  );
}

export default SharedGroupList;
