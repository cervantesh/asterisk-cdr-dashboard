import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { getEnv } from '$lib/server/config/env';

type SessionPayload = {
	sub: string;
	username: string;
	exp: number;
};

function base64UrlEncode(value: string) {
	return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
	return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value: string) {
	return createHmac('sha256', getEnv().SESSION_SECRET).update(value).digest('base64url');
}

function safeEqual(a: string, b: string) {
	const left = Buffer.from(a);
	const right = Buffer.from(b);

	if (left.length !== right.length) {
		return false;
	}

	return timingSafeEqual(left, right);
}

export async function verifyAdminCredentials(username: string, password: string) {
	const appEnv = getEnv();
	if (username !== appEnv.ADMIN_USERNAME) {
		return false;
	}

	return bcrypt.compare(password, appEnv.ADMIN_PASSWORD_HASH);
}

export function createSessionValue(username: string) {
	const appEnv = getEnv();
	const expiresAt = Date.now() + appEnv.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
	const payload: SessionPayload = {
		sub: 'admin',
		username,
		exp: expiresAt
	};
	const body = base64UrlEncode(JSON.stringify(payload));
	const signature = sign(body);

	return `${body}.${signature}`;
}

export function setSession(cookies: Cookies, username: string) {
	const appEnv = getEnv();
	cookies.set(appEnv.SESSION_COOKIE_NAME, createSessionValue(username), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: appEnv.SESSION_TTL_DAYS * 24 * 60 * 60
	});
}

export function clearSession(cookies: Cookies) {
	cookies.delete(getEnv().SESSION_COOKIE_NAME, { path: '/' });
}

export function readSession(cookies: Cookies) {
	const value = cookies.get(getEnv().SESSION_COOKIE_NAME);
	if (!value) {
		return null;
	}

	const [body, signature] = value.split('.');
	if (!body || !signature || !safeEqual(sign(body), signature)) {
		return null;
	}

	try {
		const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload;
		if (payload.exp < Date.now()) {
			return null;
		}

		return {
			id: payload.sub,
			username: payload.username
		};
	} catch {
		return null;
	}
}
