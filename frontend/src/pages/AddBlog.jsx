import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/* =========================
   Toolbar
========================= */
const Toolbar = ({ editor }) => {
  if (!editor) return null;

  const btn = (active) =>
    `px-2 py-1 border rounded ${
      active ? "bg-blue-500 text-white" : "bg-white"
    }`;

  return (
    <div className="flex flex-wrap gap-2 mb-3 border-b pb-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btn(editor.isActive("bold"))}
      >
        <b>B</b>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btn(editor.isActive("italic"))}
      >
        <i>I</i>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btn(editor.isActive("strike"))}
      >
        <s>S</s>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={btn(editor.isActive("code"))}
      >
        Code
      </button>

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={btn(editor.isActive("paragraph"))}
      >
        P
      </button>

      {[1, 2, 3, 4, 5, 6].map((level) => (
        <button
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={btn(editor.isActive("heading", { level }))}
        >
          H{level}
        </button>
      ))}

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(editor.isActive("bulletList"))}
      >
        • List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(editor.isActive("orderedList"))}
      >
        1. List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btn(editor.isActive("codeBlock"))}
      >
        Code Block
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(editor.isActive("blockquote"))}
      >
        Quote
      </button>

      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        HR
      </button>

      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        BR
      </button>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        Undo
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        Redo
      </button>
    </div>
  );
};

/* =========================
   AddBlog
========================= */
const AddBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = useSelector((s) => s.user.token);
  const selectedBlog = useSelector((s) => s.selectedBlog);
  const [tagInput, setTagInput] = useState("");

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null, // cover image only
    tags: [],
    draft: false,
  });

  /* =========================
     TipTap Editor (TEXT ONLY)
  ========================= */
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  function handleKeyDown(e) {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      if (blogData.tags.length >= 10) {
        return toast.error("You can add maximum 10 tags");
      }

      e.preventDefault();
      const tag = tagInput.trim();

      // prevent empty tag
      if (!tag) return;

      // prevent spaces inside tag
      if (tag.includes(" ")) {
        toast.error("Tags cannot contain spaces");
        return;
      }
      if (blogData.tags.includes(tag.toLowerCase())) {
        return toast.error("This tag already added");
      }

      setBlogData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.toLowerCase().trim()],
      }));
      setTagInput("");
    }
  }

  function deleteTags(index) {
    const updatedTags = blogData.tags.filter(
      (tag, tagIndex) => tagIndex !== index,
    );
    setBlogData((prev) => ({ ...prev, tags: updatedTags }));
  }
  /* =========================
     Submit Blog
  ========================= */
  const handlePostBlog = async () => {
    if (!editor) return;

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);
    formData.append("content", JSON.stringify(editor.getJSON()));
    formData.append("tags", JSON.stringify(blogData.tags));
    formData.append("draft", blogData.draft);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  /* =========================
     Update Blog
  ========================= */

  const handleUpdateBlog = async () => {
    if (!editor) return;

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);

    formData.append("content", JSON.stringify(editor.getJSON()));
    formData.append("tags", JSON.stringify(blogData.tags));
    formData.append("draft", blogData.draft);

    if (blogData?.image instanceof File) {
      formData.append("image", blogData.image);
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message);
      navigate(`/blog/${id}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  /* =========================
     Load Blog (Edit Mode)
  ========================= */
  useEffect(() => {
    if (!id || !editor) return;

    async function fetchBlog() {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
      );

      const blog = res.data.blog;

      setBlogData({
        title: blog.title || "",
        description: blog.description || "",
        image: blog.image || null,
        draft: blog.draft,
        tags: blog.tags,
      });

      if (editor && blog.content) {
        editor.commands.setContent(blog.content);
      }
    }

    fetchBlog();
  }, [id, editor]);

  // must inject content after data loads

  useEffect(() => {
    if (editor && blogData?.content) {
      editor.commands.setContent(blogData.content);
    }
  }, [editor, blogData]);

  return token == null ? (
    <Navigate to={"/signin"} />
  ) : (
    <div className="min-h-screen flex justify-center pt-10 bg-gray-50">
      <div className="w-[500px] lg:w-[1000px] mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {id ? "Update Blog" : "Create Blog"}
        </h2>

        <div className="lg:flex gap-8">
          {/* Cover Image */}
          <div className="mb-6 lg:w-[50%]">
            <label className="block text-sm font-medium mb-2">
              Cover Image
            </label>

            <label
              htmlFor="coverImage"
              className="  cursor-pointer block border-2 border-dashed rounded-lg overflow-hidden"
            >
              {blogData.image ? (
                <img
                  src={
                    typeof blogData.image === "string"
                      ? blogData.image
                      : URL.createObjectURL(blogData.image)
                  }
                  alt="preview"
                  className="w-full h-70 object-cover"
                />
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  Click to upload image
                </div>
              )}
            </label>

            <input
              id="coverImage"
              name="image"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                setBlogData((p) => ({
                  ...p,
                  image: e.target.files[0],
                }))
              }
            />
          </div>
          <div className="lg:w-[50%]">
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={blogData.title}
                onChange={(e) =>
                  setBlogData((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>

            {/* tags*/}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                rows={3}
                className="w-full border rounded-lg px-3 py-2 resize-none"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex justify-between">
                <p className="text-xs opacity-60">
                  *Click on spce bar or enter to add tage
                </p>
                <p className="text-xs opacity-60">
                  {10 - blogData.tags.length} tags remaining
                </p>
              </div>

              <div className="flex flex-wrap">
                {blogData?.tags?.map((tag, index) => (
                  <div
                    key={index}
                    className=" m-2 bg-gray-300 text-black  hover:text-white hover:bg-blue-400 rounded-full flex justify-center items-center px-3 py-2 gap-2"
                  >
                    <p>{tag}</p>
                    <i
                      className="fi fi-sr-cross-circle text-xl cursor-pointer"
                      onClick={() => deleteTags(index)}
                    ></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full border rounded-lg px-3 py-2 resize-none"
            value={blogData.description}
            onChange={(e) =>
              setBlogData((p) => ({
                ...p,
                description: e.target.value,
              }))
            }
          />
        </div>
        <div className="mb-4">
          <h2 className="block text-sm font-medium mb-1">Draft</h2>
          <select
            name=""
            id=""
            className="w-full p-3 rounded-lg border text-lg focus:outline-none"
            value={blogData.draft}
            onChange={(e) =>
              setBlogData((prev) => ({
                ...prev,
                draft: e.target.value == "true" ? true : false,
              }))
            }
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div className="border rounded-lg mb-4 overflow-hidden ">
          {/* Toolbar */}
          <div className="px-4 py-2 border-b bg-gray-50 ">
            <Toolbar editor={editor} />
          </div>

          {/* Editor */}
          <div className="px-5 py-4  ">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Submit */}

        <button
          onClick={id ? handleUpdateBlog : handlePostBlog}
          className="
w-full sm:w-auto
mx-auto
bg-blue-600 hover:bg-blue-700
text-white
px-4 py-2
text-sm sm:text-base
rounded-lg
"
        >
          {blogData.draft ? "Save as Draft" : id ? "Update Blog" : "Post Blog"}
        </button>
      </div>
    </div>
  );
};

export default AddBlog;
