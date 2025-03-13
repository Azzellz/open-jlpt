import { random } from 'radash'
import './AppLoader.css'

export default (props: any) => {
    return <div class={'loader' + random(1, 6)} />
}
