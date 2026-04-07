# Data Model: Landing Page, Demo & Admin

**Date**: 2026-04-06
**Branch**: `002-landing-admin-page`

## Entities

### SiteInfo (from API)

Representa um site registrado pelo usuário.

| Field | Type | Description |
|-------|------|-------------|
| siteId | number | ID único do site |
| clientId | string | Client ID (GUID) para integração do widget |
| siteUrl | string | URL do site registrado |
| tenant | string | Tenant associado |
| userId | number | ID do dono do site |
| status | number | 1=Active, 2=Blocked, 3=Inactive |
| createdAt | string | ISO 8601 timestamp |

### CreateSiteRequest (to API)

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| siteUrl | string | Yes | Max 2000 chars, unique |
| tenant | string | Yes | Must match configured tenant |

### UpdateSiteRequest (to API)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| siteUrl | string | No | New URL (max 2000 chars) |
| status | number | No | 1=Active, 3=Inactive |

### SiteStatus (enum)

| Value | Name | Description |
|-------|------|-------------|
| 1 | Active | Full access |
| 2 | Blocked | All access denied (system only) |
| 3 | Inactive | Read-only |

## State Model

### SiteContext State

| Field | Type | Description |
|-------|------|-------------|
| sites | SiteInfo[] | Lista de sites do usuário |
| isLoading | boolean | Se está carregando |
| error | string \| null | Mensagem de erro |

### Actions

| Action | Trigger | Effect |
|--------|---------|--------|
| loadSites | Admin mount | GET sites, set state |
| createSite | Form submit | POST site, append to list |
| updateSite | Edit save | PUT site, update in-place |

## Routes

| Route | Page | Layout | Auth |
|-------|------|--------|------|
| / | LandingPage | Public | No |
| /login | LoginPage | Public | No |
| /register | RegisterPage | Public | No |
| /admin/sites | SitesPage | Admin | Yes |
| /admin/comments | CommentsPage | Admin | Yes |
