import { useState, useEffect, useContext } from "react";
import { collection, onSnapshot, query, orderBy, writeBatch, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import AppContext from "../GlobalStore/Context";

const useMsgFetch = ({ ChatType, ChatID }) => {
  // Hooks
  const [Messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { Current_UserID } = useContext(AppContext);
  useEffect(() => {
    setIsLoading(true);
    let unsubscribe;

    if (ChatType === "DM") {
      // Private Chat Fetch
      const DMref = query(
        collection(db, "Messages", "Private_Chats", ChatID),
        orderBy("createdAt")
        // ,limitToLast(20)
      );
      unsubscribe = onSnapshot(DMref, async (snapshot) => {
        const updates = [];
        let next = [];
        await snapshot.docs.map(message => message.data())
          .forEach((msg) =>{
            next.push(msg);
            if (msg.Sender !== Current_UserID && (!Array.isArray(msg.seenBy) || msg.seenBy.length === 0))
            {
              updates.push(msg);
            }
          });
        if (updates.length > 0) {
          const batch = writeBatch(db);
          updates.forEach(update =>
          {
            let docRef = doc(db, "Messages", "Private_Chats", update.ChatID, update.id);
            batch.update(docRef, { seenBy: [Current_UserID], isSeen: true });
          })
          await batch.commit();

        }
        setMessages(next);
        setIsLoading(false);
      });

    }

    if (ChatType === "Group"){
      try {
        const docRef = doc(db, "Group_Chat_init", ChatID);
        // Group Chat Fetch
        const DMref = query(
          collection(db, "Messages", "Group_Chats", ChatID),
          orderBy("createdAt")
          // ,limitToLast(25)
        );
        unsubscribe = onSnapshot(DMref, async (snapshot) => {

          // Fetch the document
          const docSnap = await getDoc(docRef);
          const userList =
            docSnap.data()?.ChatUserID?.filter((uid) => uid !== Current_UserID) ?? [];
          ;
          console.log(userList);
          const next = [];
          const updates = [];
          snapshot.docs
            .map(message => message.data())
            .forEach((msg) =>{
              next.push(msg);
              if (msg.Sender !== Current_UserID && (!Array.isArray(msg.seenBy) || !msg.seenBy.includes(Current_UserID)))
              {
                updates.push(msg);
              }
            });

          if (updates.length > 0) {          
            const batch = writeBatch(db);
            updates.forEach(update =>{
              let docRef = doc(db, "Messages", "Group_Chats", update.ChatID, update.id);
              const baseSeenBy = Array.isArray(update.seenBy) ? update.seenBy : [];
              const newArr = Array.from(new Set([...baseSeenBy, Current_UserID]));
              const isSeen = userList.every((uid) => newArr.includes(uid));
              batch.update(docRef, { seenBy: newArr, isSeen });
            })
            await batch.commit();
          }

          setMessages(next);
          setIsLoading(false);
        });
      } 
      catch (error) {
        console.error("Error updating read receipts:", error);
        // Still show messages even if update fails
      }
    }

    // end
    return () =>{
      unsubscribe && unsubscribe();
    };
  }, [ChatType, ChatID, Current_UserID]);

  return [Messages, isLoading];
};

export default useMsgFetch;
