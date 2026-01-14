import { useDispatch, useSelector } from "react-redux";
import { closeComment, toggleComment } from "../utils/commentSlice";

function Comment() {
  const isOpen = useSelector((state) => state.comments.isOpen);

  if (!isOpen) return null;
  const dispatch = useDispatch();
  return (
    <div className="bg-white h-screen p-5 fixed top-0 right-0 w-[300px] border-l drop-shadow-xl">
      <div className="flex  justify-between">
        <h1 className="text-xl front-medium">Comments({56})</h1>
        <i
          onClick={() => dispatch(closeComment())}
          className="fi fi-rr-cross-small text-2xl"
        ></i>
      </div>
    </div>
  );
}

export default Comment;
