{
    "api/auth": [
        {
            "endpoint": "/api/auth/signup",
            "method": "POST",
            "inputs": {
                "email": "string",
                "name": "string",
                "hash": "string"
            },
            "outputs": {
                "success": "boolean",
                "data": {
                    "id": "string",
                    "email": "string",
                    "name": "string"
                },
                "error": "string"
            }
        },
        {
            "endpoint": "/api/auth/refresh",
            "method": "POST",
            "inputs": {
                "refreshToken": "string"
            },
            "outputs": {
                "accessToken": "string",
                "refreshToken": "string",
                "error": "string"
            }
        }
    ],
        "api/book": [
            {
                "endpoint": "/api/book/[id]",
                "method": "GET",
                "inputs": {
                    "bookId": "string"
                },
                "outputs": {
                    "success": "boolean",
                    "data": {
                        "id": "string",
                        "title": "string",
                        "author": "string",
                        "description": "string",
                        "image": "string",
                        "publishedDate": "string",
                        "reviews": "array",
                        "categories": "array"
                    },
                    "error": "string"
                }
            },
            {
                "endpoint": "/api/book/[id]",
                "method": "PUT",
                "inputs": {
                    "id": "string",
                    "data": {
                        "title": "string",
                        "image": "string",
                        "author": "string",
                        "description": "string"
                    }
                },
                "outputs": {
                    "success": "boolean",
                    "book": "object",
                    "error": "string"
                }
            },
            {
                "endpoint": "/api/book/[id]",
                "method": "DELETE",
                "inputs": {
                    "id": "string"
                },
                "outputs": {
                    "success": "boolean",
                    "message": "string",
                    "error": "string"
                }
            },
            {
                "endpoint": "/api/book/categories",
                "method": "GET",
                "inputs": {},
                "outputs": {
                    "success": "boolean",
                    "data": "array of objects",
                    "error": "string"
                }
            },
            {
                "endpoint": "/api/book/index",
                "method": "POST",
                "inputs": {
                    "title": "string",
                    "image": "string",
                    "author": "string",
                    "description": "string",
                    "publishedDate": "string (optional)"
                },
                "outputs": {
                    "success": "boolean",
                    "data": "object",
                    "error": "string"
                }
            },
            {
                "endpoint": "/api/book/index",
                "method": "GET",
                "inputs": {
                    "page": "number (optional)",
                    "limit": "number (optional)",
                    "search": "string (optional)",
                    "category": "string (optional)",
                    "author": "string (optional)",
                    "sortBy": "string (optional)",
                    "sortOrder": "string (optional)"
                },
                "outputs": {
                    "success": "boolean",
                    "data": "array",
                    "pagination": "object",
                    "error": "string"
                }
            },
            {
                "endpoint": "/api/book/search",
                "method": "GET",
                "inputs": {
                    "q": "string",
                    "category": "string (optional)",
                    "author": "string (optional)",
                    "minRating": "number (optional)",
                    "maxRating": "number (optional)",
                    "sortBy": "string (optional)"
                },
                "outputs": {
                    "success": "boolean",
                    "data": "array",
                    "error": "string"
                }
            },
            {
                "endpoint": "/api/book/trending",
                "method": "GET",
                "inputs": {
                    "limit": "number (optional)",
                    "period": "string (optional)"
                },
                "outputs": {
                    "success": "boolean",
                    "data": "array",
                    "error": "string"
                }
            }
        ],
            "api/review": [
                {
                    "endpoint": "/api/review/[id]",
                    "method": "GET",
                    "inputs": {
                        "reviewId": "string"
                    },
                    "outputs": {
                        "success": "boolean",
                        "data": "object",
                        "error": "string"
                    }
                },
                {
                    "endpoint": "/api/review/[id]",
                    "method": "PUT",
                    "inputs": {
                        "id": "string",
                        "content": "string",
                        "rating": "number",
                        "userId": "string"
                    },
                    "outputs": {
                        "success": "boolean",
                        "data": "object",
                        "error": "string"
                    }
                },
                {
                    "endpoint": "/api/review/[id]",
                    "method": "DELETE",
                    "inputs": {
                        "reviewId": "string",
                        "userId": "string",
                        "isAdmin": "boolean (optional)"
                    },
                    "outputs": {
                        "success": "boolean",
                        "message": "string",
                        "error": "string"
                    }
                },
                {
                    "endpoint": "/api/review/index",
                    "method": "POST",
                    "inputs": {
                        "content": "string",
                        "rating": "number",
                        "userId": "string",
                        "bookId": "string"
                    },
                    "outputs": {
                        "success": "boolean",
                        "data": "object",
                        "error": "string"
                    }
                },
                {
                    "endpoint": "/api/review/index",
                    "method": "GET",
                    "inputs": {
                        "page": "number (optional)",
                        "limit": "number (optional)",
                        "bookId": "string (optional)",
                        "userId": "string (optional)",
                        "rating": "number (optional)",
                        "sortBy": "string (optional)",
                        "sortOrder": "string (optional)"
                    },
                    "outputs": {
                        "success": "boolean",
                        "data": "array",
                        "pagination": "object",
                        "error": "string"
                    }
                }
            ],
                "api/user": [
                    {
                        "endpoint": "/api/user/[id]",
                        "method": "GET",
                        "inputs": {
                            "userId": "string"
                        },
                        "outputs": {
                            "success": "boolean",
                            "data": "object",
                            "error": "string"
                        }
                    },
                    {
                        "endpoint": "/api/user/[id]",
                        "method": "PUT",
                        "inputs": {
                            "id": "string",
                            "data": {
                                "email": "string",
                                "hash": "string",
                                "name": "string (optional)"
                            }
                        },
                        "outputs": {
                            "success": "boolean",
                            "message": "string",
                            "error": "string"
                        }
                    },
                    {
                        "endpoint": "/api/user/[id]",
                        "method": "DELETE",
                        "inputs": {
                            "id": "string"
                        },
                        "outputs": {
                            "success": "boolean",
                            "message": "string",
                            "error": "string"
                        }
                    },
                    {
                        "endpoint": "/api/user/index",
                        "method": "GET",
                        "inputs": {
                            "page": "number (optional)",
                            "limit": "number (optional)"
                        },
                        "outputs": {
                            "success": "boolean",
                            "data": "array",
                            "pagination": "object",
                            "error": "string"
                        }
                    }
                ]
};