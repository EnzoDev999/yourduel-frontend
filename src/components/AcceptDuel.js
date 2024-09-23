// import React from "react";
// import { useDispatch } from "react-redux";
// import { acceptDuel } from "../redux/slices/duelSlice"; // Import de l'action acceptDuel

// const AcceptDuel = ({ duelId }) => {
//   const dispatch = useDispatch();

//   const handleAcceptDuel = async () => {
//     try {
//       // Dispatch de l'action acceptDuel
//       await dispatch(acceptDuel(duelId)).unwrap();
//     } catch (error) {
//       console.error("Erreur lors de l'acceptation du duel :", error);
//     }
//   };

//   return (
//     <button
//       className="bg-green-500 text-white px-4 py-2 rounded"
//       onClick={handleAcceptDuel}
//     >
//       Accepter le duel
//     </button>
//   );
// };

// export default AcceptDuel;
