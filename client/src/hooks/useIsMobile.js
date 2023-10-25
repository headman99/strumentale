import { useContext } from 'react'
import { useWindowSize } from './useWindowSize'
import { IsSsrMobileContext } from '@/utils/IsSsrMobileContext'

export const useIsMobile = () => {
    const isSsrMobile = useContext(IsSsrMobileContext)
    const { width: windowWidth } = useWindowSize()
    const isBrowserMobile = !!windowWidth && windowWidth < 992

    return isSsrMobile || isBrowserMobile
}
