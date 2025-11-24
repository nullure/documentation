---
title: User Management API | OpenMemory
description: API reference for managing users and tenants in OpenMemory Backend Server.
keywords: user management api, multi-tenancy, openmemory users, tenant isolation
---

# User Management API

> [!NOTE]
> This reference is for the **Backend Server API**. Standalone Mode is typically single-user.

Manage users and isolate memories in a multi-tenant environment.

## Create User

```http
POST /users
```

```bash
curl -X POST http://localhost:8080/users \
  -H "Authorization: Bearer your_api_key" \
  -d '{ "username": "alice" }'
```

## Delete User

```http
DELETE /users/{id}
```

This will delete all memories associated with the user.
