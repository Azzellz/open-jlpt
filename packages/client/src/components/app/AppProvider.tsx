import { defineComponent } from 'vue'
import {
    NConfigProvider,
    NMessageProvider,
    NModalProvider,
    NDialogProvider,
    type GlobalThemeOverrides,
    jaJP,
    dateJaJP,
} from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#fdb5c0',
        primaryColorHover: '#fdb5c0',
        primaryColorPressed: '#fdb5c0',
        primaryColorSuppl: '#fdb5c0',
    },
}

export default defineComponent((_, { slots }) => {
    return () => (
        <NConfigProvider
            abstract
            themeOverrides={themeOverrides}
            locale={jaJP}
            dateLocale={dateJaJP}
        >
            <NMessageProvider>
                <NModalProvider>
                    <NDialogProvider>{slots.default?.()}</NDialogProvider>
                </NModalProvider>
            </NMessageProvider>
        </NConfigProvider>
    )
})
