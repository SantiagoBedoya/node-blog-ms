import axios from "axios";
import { useState } from "react";

const PostCreate = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://posts.com/posts/create", {
        title,
      });
    } catch (error) {
      console.log(`something went wrong: ${error.message}`);
    }

    setTitle("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostCreate;
