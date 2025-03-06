module.exports = (vemto) => {
  return {
    canInstall () {
      return true
    },

    onInstall () {
    },

    beforeCodeGenerationEnd () {
      let models = vemto.getProjectModels()
      let projectCruds = vemto.getProject().getMainCruds()

      vemto.log.warning(`Generate TypeScript Entity`)

      let basePath = 'app/TypeScript', options = { formatAs: 'ts', data: {} }
      models.forEach(model => {
        options.data = {
          model
        }

        vemto.renderTemplate('files/TypeScriptEntity.vemtl', `${basePath}/entities/${model.name.case('pascalCase')}.entity.ts}`, options)
      })

      projectCruds.forEach(crud => {
        const data = {
          model: {
            name: crud.model.name.case('pascalCase'),
            url: crud.url,
            controllerName: crud.model.getControllerName(),
            routes: crud.model.plural.case('paramCase'),
            modelName: crud.model.name.case('camelCase'),
            fields: crud.inputs
          }
        }

        let reactPath = `resources/js/pages/${crud.url}`
        let controllerPath = `app/Http/Controllers/${crud.model.plural.case('pascalCase')}`
        let routePath = `routes`
        options.data = data

        vemto.renderTemplate('files/pages/Form.vemtl', `${reactPath}/form/${crud.model.name.case('pascalCase')}Form.tsx`, options)
        vemto.renderTemplate('files/pages/Table.vemtl', `${reactPath}/table/${crud.model.name.case('pascalCase')}Table.tsx`, options)
        vemto.renderTemplate('files/pages/Show.vemtl', `${reactPath}/show.tsx`, options)
        vemto.renderTemplate('files/pages/Index.vemtl', `${reactPath}/index.tsx`, options)
        vemto.renderTemplate('files/pages/Edit.vemtl', `${reactPath}/edit.tsx`, options)
        vemto.renderTemplate('files/pages/Create.vemtl', `${reactPath}/create.tsx`, options)
        vemto.renderTemplate('files/pages/Controller.vemtl', `${controllerPath}/${crud.model.getControllerName()}.php`, options)
        vemto.renderTemplate('files/pages/Route.vemtl', `${routePath}/${crud.url}.php`, options)
      })
    },
  }
}
