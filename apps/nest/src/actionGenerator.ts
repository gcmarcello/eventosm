import { Project } from "ts-morph";

const CONTROLLER_PATTERN = "**/*.controller.ts";

export async function actionGenerator() {
  const project = new Project();

  project.addSourceFilesAtPaths(CONTROLLER_PATTERN);

  const controllers = project.getSourceFiles(CONTROLLER_PATTERN);

  const controllersClasses = controllers.map((c) => c.getClasses()[0]);

  const httpDecorators = ["Get", "Post", "Put", "Delete", "Patch"];

  const controllerMethods = controllersClasses.flatMap((c) =>
    c.getMethods().map((m) => {
      const parameters = m.getParameters();

      return {
        reqType: {
          body: parameters
            .find((p) => p.getDecorator("Body"))
            ?.getType()
            ?.getText(),
          query: parameters
            .find((p) => p.getDecorator("Query"))
            ?.getType()
            ?.getText(),
          params: parameters
            .find((p) => p.getDecorator("Param"))
            ?.getType()
            ?.getText(),
        },
        responseType: m.getReturnType()?.getText(),
        methodName: m.getName(),
        httpOperation: httpDecorators.find((h) =>
          m.getDecorators().find((d) => d.getName() === h)
        ),
        url: c.getDecorator("Controller")?.getArguments()[0]?.getText() || "/",
        file: c.getSourceFile().getFilePath(),
      };
    })
  );

  console.log(controllerMethods);
}
