import { getClientType } from '@/utils'
import type { VNode } from 'vue'

interface Props {
    mobile?: () => VNode
    desktop?: () => VNode
}
export default function ClientSwitch(props: Props){
    const clientType = getClientType()
    return clientType === 'mobile' ? props.mobile?.() || null : props.desktop?.() || null
}
