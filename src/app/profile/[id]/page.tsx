"use client";
import NavBar from "@/components/NavBar";
import deleteCache from "@/helpers/deleteCache";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function IdPage({params} : any) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({title: '', action: () => {}});

  const buttonClick = (actionType: string) => {
    switch (actionType) {
      case "clearAllNotes": {
        setModalContent({title: 'Clear all your notes', action: () => handleClearAllNotes()});
        setShowModal(true);
      }
      break;
      case "deleteAccount": {
        setModalContent({title: 'Delete your account', action: () => handleDeleteAccount()});
        setShowModal(true);
      }
    }
  }

  const handleClearAllNotes = async () => {
    console.log("clearing all notes")
    setShowModal(false);
    try {
      await axios.post('/api/users/clearallnotes', {id: params.id});
      deleteCache();
      toast.success('All notes cleared! 👍')
    } catch (error:any) {
      toast.error(error.response.status + " " + error.response.data.error)
      console.log(error.response.status + " " + error.response.data.error)
    }
  }

  const handleDeleteAccount = async () => {
    console.log("deleting account")
    setShowModal(false);
    try {
      deleteCache();
      await axios.post('/api/users/deleteaccount', {id: params.id});
      await axios.get('/api/users/logout');
      toast.success('Account deleted! 👍')
      router.push('/login');
    } catch (error:any) {
      toast.error(error.response.status + " " + error.response.data.error)
      console.log(error.response.status + " " + error.response.data.error)
    }
  }
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
    <NavBar />
    {/* Modal */}
    {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-lg flex flex-col justify-center items-center">
            <h3 className="text-lg text-black font-semibold mb-4">Are you sure you want to {modalContent.title}?</h3>
            <div className="flex justify-end">
              <button onClick={modalContent.action} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Confirm</button>
              <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )} 
    
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-2xl underline text-spray-50 font-bold mb-4">Account actions</h1>
      <div className="flex justify-center items-center border border-spray-50 rounded-lg gap-10 p-10">
        <button onClick={() => buttonClick("clearAllNotes")} className="border border-red-600 rounded-lg text-red-500 hover:underline active:text-red-700 px-4 py-2">Clear all Notes</button>
        <button onClick={() => buttonClick("deleteAccount")} className="border border-red-600 rounded-lg text-red-500 hover:underline active:text-red-700 px-4 py-2">Delete Account</button>
      </div>
    </div>
    <Toaster />
    </div>
  )
}