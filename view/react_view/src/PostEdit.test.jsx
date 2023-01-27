import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
// import ShallowRenderer from 'react-test-renderer/shallow';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import PostEdit from "./PostEdit";
import { AuthProvider } from './Authentication/AuthContext';
import { post_api_url } from './settings'
import authentication_api_url from './Authentication/authentication_api_url';


const userData = {
    user_id: 0,
    username: 'test'
}

const authContext = {
    ...userData,
    access: 'testaccess',
    refresh: 'testrefresh',
}

const date1 = (new Date(2002, 6, 3, 10, 10, 10)).toLocaleDateString();
const postList = [
    {
        id: 0,
        title: 'Post Zero',
        body: 'post body 0',
        slug: 'post0',
        updated: date1,
        created: date1,
        author: 0
    },
    {
        id: 1,
        title: 'Post One',
        body: 'post body 1',
        slug: 'post1',
        updated: date1,
        created: date1,
        author: 0
    },
    {
        id: 2,
        title: 'Post two',
        body: 'post body 2',
        slug: 'post2',
        updated: date1,
        created: date1,
        author: 0
    }
]

const isGetPostUrl = (splittedPathname) => {
    if (splittedPathname.lenght !== 2) return false;
    if (splittedPathname[0] !== 'post') return false;
    return true;
}

const fetchRequests = []

const mockFetchOk = (url, options) => {
    let response;
    options = options ? options : { method: 'GET' }
    const method = options.method
    const workingUrl = new URL(url);
    fetchRequests.push({ options, pathname: workingUrl.pathname })
    switch (url) {
        case authentication_api_url + 'token/refresh/':
        case authentication_api_url + 'token/':
            response = authContext
            break
        case authentication_api_url + `user/`:
            response = {[userData.id]: userData}
            break
        case post_api_url:
            if (method === 'GET') {
                response = postList
                break
            }
        default:
            const splittedPathname = workingUrl.pathname.split('/').filter(i => i)
            if (isGetPostUrl(splittedPathname) && method === 'GET') {
                const currentPostId = parseInt(splittedPathname[1])
                response = postList[currentPostId]
                break
            } else if (method !== 'GET') {
                response = { ok: true, method: options.method, pathname: splittedPathname }
                break
            }
            response = { error: 'Invalid url', ok: false }
            console.log(['fail', method, url])
            return Promise.resolve({
                json: () => Promise.resolve(response)
            })
    }
    return Promise.resolve({
        json: () => Promise.resolve(response),
        status: 200
    })
}

vi.mock("jwt-decode", () => ({ 
    default: vi.fn(param => {
        if (param === authContext.access) {
            return userData
        } else if (typeof param === 'string' || param instanceof String) {
            try {
                return JSON.parse(param)
            } catch (error) {
                console.log('mock jwt-decode json parse failed:')
                console.log(param)
            }
        }
        return param
    }) 
}))

describe('PostEdit', () => {
    beforeAll(() => {
        global.fetch = vi.spyOn(global, 'fetch').mockImplementation(mockFetchOk)
    })

    afterAll(() => {
        vi.restoreAllMocks();
        cleanup()
    })

    it('should render', () => {
        const renderer = (
            <MemoryRouter initialEntries={[`/post/${postList[0].slug}/edit`]}>
                <AuthProvider>
                    <Routes>
                        <Route path={`/post/:post_slug/edit`} element={<PostEdit />}>
                        </Route>
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        )
        render(renderer)
    })

    it('should find title, body and slug texts', async () => {
        await waitFor(() => {
            expect(screen.getByRole("title-input").value).toEqual(postList[0].title)
            expect(screen.getByRole("body-textarea").value).toEqual(postList[0].body)
            expect(screen.getByRole("slug-input").value).toEqual(postList[0].slug)
        })
    })

    it('should not be able to update, for there are no changes', () => {
        const summitButton = screen.getByRole("summit")
        expect(summitButton.disabled).toBeTruthy()
        const fetchRequestsLenght = fetchRequests.length
        summitButton.click()
        expect(fetchRequestsLenght).toEqual(fetchRequests.length)
    })

    it('should change title, body, and slug', () => {
        const titleInput = screen.getByRole("title-input")
        const bodyInput = screen.getByRole("body-textarea")
        const slugInput = screen.getByRole("slug-input")

        const summitButton = screen.getByRole("summit")

        fireEvent.change(titleInput, {target: {value: 'New Post title'}})
        fireEvent.change(bodyInput, {target: {value: 'New Post body'}})
        fireEvent.change(slugInput, {target: {value: 'new-slug'}})

        expect(summitButton.disabled).toBeFalsy()

        const fetchRequestsLenght = fetchRequests.length
        summitButton.click()
        expect(fetchRequestsLenght).toBeLessThan(fetchRequests.length)

        
        const lastFetchRequest = fetchRequests[fetchRequests.length - 1]
        expect(lastFetchRequest.pathname.includes(postList[0].id)).toBeTruthy()
        expect(lastFetchRequest.options.method).toEqual('PUT')

        const sentBody = JSON.parse(lastFetchRequest.options.body)
        expect(sentBody.title).toEqual('New Post title')
        expect(sentBody.body).toEqual('New Post body')
        expect(sentBody.slug).toEqual('new-slug')
    })

})
