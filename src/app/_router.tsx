import { createBrowserRouter } from "react-router-dom";
import App from "./_root";
import { CreateChat } from "./fragments/CreateChat";
import { Chat } from "./fragments/Chat";

export const _router = createBrowserRouter([{
    path: '/',
    element: <App />,
    children: [{
        path: '/',
        element: <CreateChat />
    }, {
        path: '/chat/:id',
        element: <Chat />
    }]
}]);