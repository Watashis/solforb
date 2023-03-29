import { Link } from "react-router-dom";
export function Button(props) {
    let style = "btn"
    switch (props.style) {
        case 'danger':
            style = `${style} btn-danger`
            break

        case 'success':
            style = `${style} btn-success`
            break

        case undefined:
            style = `${style} btn-primary`
            break

        default:
            style = `${style} btn-primary`
            break
    }
    //<button type="button" class="btn btn-danger">Danger</button>
    if (props.link != undefined) {
        return <Link type="button" className={style} to={props.link}>{props.children}</Link>
    } else {
        return <button type="button" className={style} onClick={props.onClick}>{props.children}</button>
    }

}