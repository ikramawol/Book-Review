import React, { useState } from 'react'

const Comment = ({ review }) => {
    console.log("reviwe", review)
    function stars(n) {
        return '★★★★★'.slice(0, n) + '✰✰✰✰✰'.slice(n, 5);
    }


    const flagComment = async (str) => {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                console.error('No access token found. Please log in.')
                return
            }

            const reviewR = await fetch(`${API_BASE_URL}/api/report/${review.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reason: str,
                })
            })

            if (!reviewR.ok) {
                const errorData = await reviewR.json()
                console.error('Review submission failed:', errorData)
                return
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleFlag = () => {
        const reason = prompt("Please enter your resons:");

        if (reason !== null && reason !== "") {
            alert(`Thank you for your report it will be reviewed!`);
            flagComment(reason)
        }
    }

    return (
        <div className='commentWrapper'>
            <div className="avatar">
                <img src="./pfp.png" alt="" srcset="" />
                <p>{stars(review.rating)}</p>
            </div>
            <div className="commentWrap">
                <p>{review.content}</p>
                <i onClick={handleFlag}>🚩</i>
            </div>
        </div>
    )
}

export default Comment