import React, { useEffect, useState } from "react";
import NoteCard from "../../components/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "../Home/AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../..//components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { EmptyCard } from "../../components/EmptyCard/EmptyCard";
import BASE_URL from "../../congig";

const Home = () => {
  const { currentUser, loading, errorDispatch } = useSelector(
    (state) => state.user
  );
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const [isSearch,setIsSearch]=useState(false)

  // console.log(allNotes)
  const navigate = useNavigate();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    if (currentUser === null || !currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser?.rest);
      getAllNotes();
    }
  }, []);
  //get all notes

  const getAllNotes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/note/all`, {
        withCredentials: true,
      });
      if (res.data.success === false) {
        console.log(res.data);
        return;
      }
      // console.log(res.data);

      setAllNotes(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  //delete note

  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/note/delete/` + noteId,
        { withCredentials: true }
      );
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast(error.message);
    }
  };

  const onSearchNote= async (query)=>{
    try{
      const res=await axios.get(`${BASE_URL}/api/note/search`,
        {params:{query},withCredentials:true}
      )
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      setIsSearch(true)
      setAllNotes(res.data.notes)
    }catch(error){
      toast.error(error.message)
    }
  }

  const handleClearSearch=()=>{
    setIsSearch(false)
    getAllNotes()
  }

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id

    try {
      const res = await axios.put(
        `${BASE_URL}/api/note/update-notepinned/` + noteId,
        { isPinned: !noteData.isPinned },
        { withCredentials: true }
      )

      if (res.data.success === false) {
        toast.error(res.data.message)
        console.log(res.data.message)
        return
      }

      toast.success(res.data.message)
      getAllNotes()
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 
      max-md:m-5"
          >
            {allNotes.map((note, index) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdAt}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => {
                  handleEdit(note);
                }}
                onDelete={() => {
                  deleteNote(note);
                }}
                onPinNote={() => {
                  updateIsPinned(note)
                }}
              />
            ))}
          </div>  
        ) : (
          <EmptyCard
            imgSrc={
              isSearch?"https://img.freepik.com/premium-vector/no-result-found-empty-results-popup-design_586724-96.jpg?semt=ais_hybrid"
              :"https://static.vecteezy.com/system/resources/previews/024/467/518/non_2x/colored-sticky-notes-paper-illustration-blank-paper-sheets-for-note-cute-notes-paper-stickers-for-your-message-blank-notes-with-elements-of-planning-for-business-office-writing-reminds-vector.jpg"
            }
            message={isSearch?"Oops!! No Notes Found Matching Your Search":
           "  Ready to capture your ideas? Click the 'Add' buttonto start noting down your thoughts,reminders.Let's get started!"
            }
          />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-md:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white 
      rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;
