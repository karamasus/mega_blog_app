import Input from '../Input'
import Button from '../Button'
import Select from '../Select'
import RTE from '../RTE'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addPost, updatePost } from '../../store/postSlice.js'

const PostForm = ({ post }) => {
    const { register, handleSubmit, watch, setValue, control, getValues, reset } = useForm({
        defaultValues: {
            title: post ? post.title : '',
            slug: post ? post.slug : '',
            content: post ? post.content : 'This is Post content.',
            status: post ? post.status : 'inactive'
        }
    })
    const [featuredImage, setFeaturedImage] = useState(post ? post.featuredImage : null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const submit = async (data) => {
        if (!featuredImage) {
            alert('Please upload your blog image')
            return
        }

        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('slug', data.slug)
        formData.append('content', data.content)
        formData.append('status', data.status)
        formData.append('featuredImage', featuredImage)

        try {
            let res
            if (post) {
                res = await axios.put(`http://localhost:5000/api/posts/${post.slug}`, formData, { withCredentials: true })
            } else {
                res = await axios.post(`http://localhost:5000/api/posts`, formData, { withCredentials: true })
            }
            if (res?.data?.success) {
                alert(res.data.message)
                reset()
                if (post)
                    dispatch(updatePost({ newContent: res.data.updatedPost, slug: post.slug }))

                dispatch(addPost(res.data.newPost))
                navigate('/')
            }
        } catch (err) {
            if (err.response) {
                console.log(err.response)
                alert(err.response.data.message || 'Something went wrong')
            } else
                console.log(err)
        }
    }

    return (
        <form className="flex flex-wrap" onSubmit={handleSubmit(submit)}>
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register('title', {
                        required: true
                    })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register('slug', {
                        required: true
                    })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {/* <RTE label='Contents: ' name='content' control={control} defaultValue={getValues('content')} /> */}
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    onChange={
                        (e) => {
                            const file = e.target.files[0]
                            if (file && file.size > 2 * 1024 * 1024) {
                                alert('Image size must be less than 2MB')
                                e.target.value = ''
                                setFeaturedImage(null)
                            } else
                                setFeaturedImage(file)
                        }
                    }
                />
                {
                    post && <img className='' src={`${import.meta.env.VITE_API_URL}/${post.featuredImage}`} />
                }
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register('status', {
                        required: true
                    })}
                />
                <Button type="submit" className="w-full">
                    {post ? 'Update' : 'Submit'}
                </Button>
            </div>
        </form>
    )
}

export default PostForm

