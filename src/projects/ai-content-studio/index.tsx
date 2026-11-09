import { Navigate, Route, Routes } from 'react-router-dom'
import { StudioLayout } from './StudioLayout'
import { DashboardPage } from './pages/DashboardPage'
import { CreatePage } from './pages/CreatePage'
import { EditorPage } from './pages/EditorPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { BrandSettingsPage } from './pages/BrandSettingsPage'
import { WorkflowPage } from './pages/WorkflowPage'

/** AI Content Studio routes, mounted at /studio/* */
export default function StudioApp() {
  return (
    <Routes>
      <Route element={<StudioLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="create" element={<CreatePage />} />
        <Route path="editor/:id" element={<EditorPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="brand" element={<BrandSettingsPage />} />
        <Route path="workflow" element={<WorkflowPage />} />
        <Route path="*" element={<Navigate to="/studio" replace />} />
      </Route>
    </Routes>
  )
}
