import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios';
import Endpoints from '../../config/endpoints';
import { UserContext } from '../../components/Root';
import Loader from '../../components/Loader';
import { Link, withRouter } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { createRestaurantEditRoute } from './EditRestaurantPage';
import ExtendedForm from '../../components/ExtendedForm';
import MainService from '../../services/MainService';
import { USER_ROLES } from '../../components/ProtectedRoute';
import Rating from '../../components/Rating';

export const RESTAURANT_DETAIL_ROUTE = '/restaurant/:id';

export const createRestaurantDetailRoute = id => '/restaurant/' + id;

function RestaurantDetailPage({ match }) {

    const { user, setUser } = useContext(UserContext);

    const { params: { id } } = match;

    const [restaurant, setRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        MainService.showRestaurants(id, user)
            .then(response => {
                let { message, restaurant } = response;
                restaurant.created_at = moment(restaurant.created_at).format('D MMM Y');
                setRestaurant(restaurant);
                setIsLoading(false);
            })
    }, []);

    return (
        <div className="RestaurantDetailPage">
            {
                isLoading
                    ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader />
                        </div>
                    )
                    : (
                        <div>
                            <div className="text-gray-600 font-bold t-5 text-xs">ID: {restaurant.id}</div>
                            <div className="text-md font-bold uppercase">
                                {restaurant.name}
                                {
                                    user && user.role !== USER_ROLES.REGULAR && <Link to={createRestaurantEditRoute(restaurant.id)} className="text-xs text-blue-400 lowercase px-2">edit</Link>
                                }
                            </div>
                            <div className="text-gray-600 font-bold text-xs">{restaurant.created_at}</div>
                            {/* TODO: add image */}
                            <div className="text-gray-600 font-bold text-sm">
                                {(restaurant.address ?? "").split("\n").map((line, i) => <p key={i}>{line}</p>)}
                            </div>
                            {
                                restaurant.image && <img src={restaurant.image} className="block my-2" />
                            }
                            <div className="text-gray-600 font-bold mb-2 text-sm">Max Rating: <Rating rating={restaurant.max_rating} /></div>
                            <div className="text-gray-600 font-bold mb-2 text-sm">Min Rating: <Rating rating={restaurant.min_rating} /></div>
                            <div className="text-gray-600 font-bold mb-2 text-sm">Average Rating: <Rating rating={restaurant.average_rating} /></div>
                            <div className="text-gray-600 font-bold mb-2 text-sm">Pending Reviews: {restaurant.pending_reviews}</div>
                            <br />
                            <div className="text-md mb-4 font-bold uppercase">Reviews</div>
                            <div className="my-3">
                                {
                                    restaurant.reviews.length > 0
                                        ? restaurant.reviews.map(review => (
                                            <ReviewCard review={review} key={review.id} user={user} restaurant={restaurant} setRestaurant={setRestaurant} />
                                        ))
                                        : <div>No reviews yet!</div>
                                }
                            </div>
                            {
                                user && user.role === USER_ROLES.REGULAR &&
                                    restaurant.reviews.findIndex(review => review.user.id === user.id) === -1
                                    ? <ReviewForm
                                        restaurantId={restaurant.id}
                                        onSuccess={review => {
                                            const reviews = [...restaurant.reviews];
                                            reviews.push(review);
                                            setRestaurant({ ...restaurant, reviews });
                                        }}
                                        user={user} />
                                    : <div></div>
                            }
                        </div >
                    )
            }
        </div >
    )
}

function ReviewCard({ review, user, restaurant, setRestaurant }) {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        isEditing
            ? (
                <ReviewForm
                    user={user}
                    restaurantId={restaurant.id}
                    defaultRating={review.rating}
                    defaultComment={review.comment}
                    isCancelable
                    reviewId={review.id}
                    submitButtonLabel="Update"
                    onCancel={() => {
                        setIsEditing(false);
                    }}
                    onSuccess={review => {
                        const reviews = [...restaurant.reviews];
                        reviews.splice(reviews.findIndex(r => r.id === review.id), 1, review);
                        setRestaurant({ ...restaurant, reviews })
                        setIsEditing(false);
                    }}
                />
            )
            : isDeleting
                ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader />
                    </div>
                )
                : (
                    <div className="shadow px-4 py-2 my-3" key={review.id}>
                        <div className="text-xs text-gray-600">{review.user.name}</div>
                        <Rating rating={review.rating} className="my-1" />
                        <p>{review.comment}</p>
                        <p className="text-gray-600 text-xxs">{moment(review.updated_at).format('h:mm A, D MMM Y')}</p>
                        {
                            (user && ((user.role === USER_ROLES.REGULAR && user.id === review.user.id) || user.role === USER_ROLES.ADMIN)) && (
                                <span>
                                    <span className="cursor-pointer text-xxs mx-1 text-gray-600" onClick={() => setIsEditing(!isEditing)}>Edit</span>
                                    <span className="cursor-pointer text-xxs mx-1 text-red-600" onClick={() => {
                                        setIsDeleting(true);
                                        MainService.deleteReview(review.id, user)
                                            .then(response => {
                                                const reviews = [...restaurant.reviews];
                                                reviews.splice(reviews.findIndex(r => r.id === review.id), 1);
                                                setRestaurant({ ...restaurant, reviews })
                                            });
                                    }}>Delete</span>
                                </span>
                            )
                        }
                        {
                            review.reply
                                ? (
                                    <ReplyBox reply={review.reply} user={user} restaurant={restaurant} review={review} setRestaurant={setRestaurant} />
                                )
                                : (
                                    user && user.role === USER_ROLES.OWNER && user.id === restaurant.user_id
                                    && <ExtendedForm
                                        elements={[{
                                            name: "comment",
                                            label: "Reply",
                                            placeholder: "Add a reply...",
                                            value: "",
                                        }]}
                                        submitButtonLabel="Reply"
                                        formClass="text-sm w-1/2 mt-5"
                                        onSubmit={async (values, { setErrors, setSubmitting }) => {
                                            const { reply } = await MainService.addReply(review.id, values, user);
                                            addReply(review.id, reply, restaurant, setRestaurant);
                                        }} />
                                )
                        }
                    </div>
                )
    )
}

function ReviewForm({
    user,
    restaurantId,
    defaultRating = 0,
    defaultComment = "",
    onSuccess = review => { },
    isCancelable = false,
    reviewId = null,
    onCancel = () => { },
    submitButtonLabel = "Add Review"
}) {

    const [isLoading, setIsLoading] = useState(false)
    const [rating, setRating] = useState(defaultRating);
    const [comment, setComment] = useState(defaultComment);
    const [errors, setErrors] = useState(null);

    return (
        <div>
            <Rating
                onClick={rating => { setRating(rating) }}
                rating={rating}
                editable />
            {
                errors && errors.rating &&
                <span className="text-xs mb-3 block text-red-500">
                    {errors.rating[0]}
                </span>
            }
            <textarea
                name="comment"
                value={comment}
                onChange={(e) => { setComment(e.target.value) }}
                rows={4}
                className="border block mb-1 px-2 py-1 my-3 lg:w-1/3 md:w-1/2 w-full"
                placeholder="Add a review..." />
            {
                errors && errors.comment &&
                <span className="text-xs mb-3 block text-red-500">
                    {errors.comment[0]}
                </span>
            }
            {
                isLoading
                    ? <div className="pt-2"><Loader size={24} /></div>
                    : (
                        <div>
                            <button
                                className="bg-orange-500 border border-orange-500 rounded text-sm px-3 py-1 text-white uppercase mr-2 my-2"
                                type="button"
                                onClick={() => {
                                    setIsLoading(true);
                                    (
                                        reviewId !== null
                                            ? MainService.editReview(reviewId, {
                                                rating, comment
                                            }, user)
                                            : MainService.addReview(restaurantId, {
                                                rating, comment
                                            }, user)
                                    )
                                        .then(response => {
                                            onSuccess({ ...response.review, user });
                                        })
                                        .catch(error => {
                                            setIsLoading(false);
                                            setErrors(error.response.data.errors);
                                        });
                                }}
                            >{submitButtonLabel}</button>
                            {

                                isCancelable &&
                                <button
                                    className="bg-orange-500 border border-red-500 rounded text-sm px-3 py-1 text-white uppercase mr-2 my-2"
                                    type="button"
                                    onClick={onCancel}
                                >Cancel</button>
                            }
                        </div>
                    )
            }
        </div>
    );
}

function ReplyBox({ reply, review, user, restaurant, setRestaurant }) {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <div className="border-t border-0 mt-2 py-2 px-3 text-sm">
            {
                isDeleting
                    ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader />
                        </div>
                    )
                    : isEditing
                        ? (
                            <ExtendedForm
                                elements={[{
                                    name: "comment",
                                    label: "Reply",
                                    placeholder: "Add a reply...",
                                    value: reply.comment
                                }]}
                                validate={values => {
                                    const errors = {};
                                    if (!values.comment) {
                                        errors.comment = "Comment cannot be empty!";
                                    }
                                    return errors;
                                }}
                                submitButtonLabel="Update"
                                formClass="text-sm md:w-1/2"
                                hasCancelButton
                                onCancelButtonClick={() => { setIsEditing(false) }}
                                onSubmit={async (values, { setErrors, setSubmitting }) => {
                                    const { reply: r } = await MainService.editReply(reply.id, values, user);
                                    addReply(r.review_id, r, restaurant, setRestaurant);
                                    setIsEditing(false);
                                }}
                            />
                        )
                        : (
                            <>
                                <div className="text-xs text-gray-600">Owner</div>
                                <p>{reply.comment}</p>
                                <p className="text-gray-600 text-xxs">{moment(reply.updated_at).format('h:mm A, D MMM Y')}</p>
                                {
                                    user && user.role !== USER_ROLES.REGULAR && <span className="cursor-pointer text-xxs text-gray-600" onClick={() => setIsEditing(!isEditing)}>Edit</span>
                                }
                                {
                                    user && user.role !== USER_ROLES.REGULAR &&
                                    <span className="cursor-pointer text-xxs mx-1 text-red-600" onClick={() => {
                                        setIsDeleting(true);
                                        MainService.deleteReply(reply.id, user)
                                            .then(response => {
                                                const reviews = [...restaurant.reviews];
                                                const oldReview = reviews.find(r => r.id === review.id);
                                                oldReview.reply = null;
                                                reviews.splice(reviews.findIndex(r => r.id === review.id), oldReview);
                                                setRestaurant({ ...restaurant, reviews })
                                            });
                                    }}>Delete</span>
                                }
                            </>
                        )
            }
        </div>
    );
}

function addReply(reviewId, reply, restaurant, setRestaurant) {
    const reviews = restaurant.reviews.map(review => {
        if (review.id === reviewId) {
            review.reply = reply;
        }
        return review;
    });
    setRestaurant({ ...restaurant, reviews });
}

export default withRouter(RestaurantDetailPage)
