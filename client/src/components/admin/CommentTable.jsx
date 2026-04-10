import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CommentTable = ({comment, fetchComments}) => {

    const { axios } = useAppContext();
    const date = new Date(comment.created_at);

    const handleApprove = async () => {
        try {
            const { data } = await axios.post('/api/admin/approve-comment', { id: comment.id });
            if (data.success) {
                toast.success(data.message);
                fetchComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const { data } = await axios.post('/api/admin/delete-comment', { id: comment.id });
            if (data.success) {
                toast.success(data.message);
                fetchComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

  return (
    <tr className='border-y border-gray-300'>
        <td className='px-6 py-4'>
            <b className='font-medium text-gray-600'>Blog</b> :{comment.blog_title || 'N/A'}
            <br />
            <br />
            <b className='font-medium text-gray-600'>Name</b> :{comment.name}
            <br />
            <b className='font-medium text-gray-600'>Comment</b> :{comment.content}
        </td>
        <td className='px-6 py-4 max-sm:hidden'>
            {date.toLocaleDateString()}
        </td>
        <td className='px-6 py-4'>
            <div className='inline-flex items-center gap-4'>
                {!comment.is_approved ? 
                <img onClick={handleApprove} src={assets.tick_icon} className='w-5 hover:scale-110 transition-all cursor-pointer'/>:
                <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1'>Approved</p>}
                <img onClick={handleDelete} src={assets.bin} alt="" className='w-5 hover:scale-110 transition-all cursor-pointer'/>
            </div>
        </td>
    </tr>
  )
}

export default CommentTable