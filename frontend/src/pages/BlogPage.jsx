import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  addSelectedBlog,
  removeSelectedBlog,
} from "../utils/selectedBlogSlice";
import { toggleComment, setIsOpen } from "../utils/commentSlice";
import Comment from "../components/Comment";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function BlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { token, user, id: userId } = useSelector((s) => s.user);
  const { comments } = useSelector((state) => state.selectedBlog);

  const [blogData, setBlogData] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const { isOpen } = useSelector((state) => state.comments);

  // =========================
  // Fetch blog
  // =========================
  async function fetchBlogById() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
      );

      const blog = res.data.blog;
      setBlogData(blog);
      dispatch(addSelectedBlog(blog));

      if (blog.likes.includes(userId)) {
        setIsLike(true);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  }

  // =========================
  // TipTap viewer (READ ONLY)
  // =========================
  const viewer = useEditor({
    extensions: [StarterKit],

    editable: false,
  });

  // =========================
  //Inject content after blogData loads
  // =========================

  useEffect(() => {
    if (viewer && blogData?.content) {
      viewer.commands.setContent(blogData.content);
    }
  }, [viewer, blogData]);

  // =========================
  // Like handler
  // =========================
  async function handleLike() {
    if (!token) {
      toast.error("Please signin to like this blog");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/like/${blogData._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setIsLike((p) => !p);
      fetchBlogById();
    } catch (error) {
      toast.error("Failed to like blog");
    }
  }

  useEffect(() => {
    fetchBlogById();

    return () => {
      dispatch(setIsOpen(false));
      dispatch(removeSelectedBlog());
    };
  }, [id]);

  if (!blogData) return <h1 className="text-center">Loading…</h1>;

  return (
    <div className="max-w-[1100px] mx-auto px-4">
      {/* =========================
          HEADER
      ========================= */}
      <div className="max-w-2xl mx-auto">
        <h1 className="mt-10 font-bold text-4xl leading-tight">
          {blogData.title}
        </h1>

        <p className="mt-3 text-lg text-gray-600">{blogData.creator.name}</p>

        {/* =========================
            COVER IMAGE (CONTROLLED)
        ========================= */}
        <div className="mt-5">
          <img
            src={blogData.image}
            alt="blog cover"
            className="
              w-full
              max-h-[350px]
              object-cover
              rounded-2xl
              shadow-sm
            "
          />
        </div>

        {/* =========================
            ACTION BAR
        ========================= */}
        <div className="flex items-center justify-between mt-5">
          {token && user.email === blogData.creator.email && (
            <Link to={`/edit/${blogData.blogId}`}>
              <button className="bg-green-500 px-4 py-1 text-white rounded">
                Edit
              </button>
            </Link>
          )}

          <div className="flex gap-6">
            <div
              onClick={handleLike}
              className="flex gap-2 items-center cursor-pointer"
            >
              <i
                className={`fi ${
                  isLike
                    ? "fi-sr-thumbs-up text-blue-600"
                    : "fi-rr-social-network"
                } text-xl`}
              />
              <span>{blogData.likes.length}</span>
            </div>

            <div
              className="flex gap-2 items-center cursor-pointer"
              // changeeee**************
              // onClick={() => dispatch(toggleComment())}
            >
              <i
                className="fi fi-sr-comment-alt text-xl"
                onClick={() => dispatch(setIsOpen())}
              />
              <span>{comments?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* =========================
            BLOG CONTENT (TipTap)
        ========================= */}
        {viewer && (
          <div className="mt-10">
            <div className="prose prose-lg max-w-none">
              <EditorContent editor={viewer} />
            </div>
          </div>
        )}
      </div>

      {/* =========================
          COMMENTS
      ========================= */}
      {isOpen && <Comment />}
    </div>
  );
}

export default BlogPage;
