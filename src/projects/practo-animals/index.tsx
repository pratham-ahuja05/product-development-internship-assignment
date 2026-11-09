import { Route, Routes } from 'react-router-dom'
import { PractoLayout } from './PractoLayout'
import { PractoHomePage } from './HomePage'
import { PractoSearchPage } from './SearchPage'

/** Practo for Animals routes, mounted at /practo/* */
export default function PractoApp() {
  return (
    <Routes>
      <Route element={<PractoLayout />}>
        <Route index element={<PractoHomePage />} />
        <Route path="search" element={<PractoSearchPage />} />
        <Route path="*" element={<PractoHomePage />} />
      </Route>
    </Routes>
  )
}
