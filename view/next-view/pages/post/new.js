import PostEdit from "../../components/PostEdit";
import PrivateComponent from "../../components/authentication/PrivateComponent";


export default function PrivatePostEdit() {
    return <PrivateComponent><PostEdit /></PrivateComponent>
}