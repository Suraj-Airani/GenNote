import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast'

const BlogTableData = ({blog, fetchBlogs, index}) => {

    const {title, created_at} = blog;
    const BlogDate = new Date(created_at)

    const {axios} = useAppContext();

    const handleDelete = async () => {
    try {
      const { data } = await axios.delete('/api/admin/blog/delete', { data: { id: blog.id }});
      if(data.success){
        toast.success("Blog deleted successfully");
        fetchBlogs(); // Refresh blog list after deletion
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTogglePublish = async () => {
    try {
      const { data } = await axios.patch(`/api/admin/blog/toggle-publish/${blog.id}`);
      if(data.success){
        toast.success("Publish status updated");
        fetchBlogs(); // Refresh blog list after status toggle
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className='border-y border-gray-300'>
        <th className='px-2 py-4'>{index}</th>
        <td className='px-2 py-4'>{title}</td>
        <td className='px-2 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
        <td className='px-2 py-4 max-sm:hidden'>
            <p className={`${blog.is_published ? "text-green-600" : "text-orange-700"}`}>
            {blog.is_published ? 'Published':'Unpublished'}
            </p>
        </td>
        <td className='px-2 py-4 flex text-xs gap-3'>
            <button onClick={handleTogglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>
                {blog.isPublished ? 'Unpublsih':'Publish'}
            </button>
            <img onClick={handleDelete} src={assets.cross_icon} className='w-8 hover:scale-110 transition-all cursor-pointer' alt="" />
        </td>
    </tr>
  )
}

export default BlogTableData