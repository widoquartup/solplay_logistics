import fs from 'fs';
import { postmanCollectionFilePath, postmanEnvironmentFilePath } from '@src/paths';



export class PostmanCollectionManager {
    private collectionFilePath: string;
    /* eslint-disable-next-line */
    private collection: any;
    private environmentFilePath: string;
    /* eslint-disable-next-line */
    private environment: any;
    constructor() {
        this.collectionFilePath = postmanCollectionFilePath;
        this.environmentFilePath = postmanEnvironmentFilePath;
        this.importCollection();
        this.importEnvironment();
    }

    private importCollection() {
        try {
            // Lee el archivo JSON existente de la colección de Postman
            let collectionContent: string = '';
            try {
                collectionContent = fs.readFileSync(this.collectionFilePath, 'utf8');
            } catch (error) {
                console.error("error al recuperar el contenido del json collection postman");
            }
            this.collection = JSON.parse(collectionContent);
        } catch (error) {
            console.error('Error al importar la colección de Postman:', error);
            throw new Error('Error al importar el colección de Postman');
        }
    }
    private importEnvironment() {
        try {
            const environmentContent = fs.readFileSync(this.environmentFilePath, 'utf8');
            this.environment = JSON.parse(environmentContent);
        } catch (error) {
            console.error('Error al importar el environment de Postman:', error);
            throw new Error('Error al importar el environment de Postman');
        }
    }
    /* eslint-disable-next-line */
    public addFolder(folderName: string, routes: any[], apiPath: string) {
        const resource = folderName.toLowerCase();
        const arrApiPath = apiPath.split("/");
        const folderItem = {
            name: folderName,
            item: routes.map(route => {
                const isGetOne = route.method.toLowerCase() === 'get' && route.path.includes(`:${resource}_id`);
                const isPost = route.method.toLowerCase() === 'post';
                const pathVariables = route.path.split('/').filter((p: string) => p.startsWith(':')).map((p: string) => p.slice(1));
                pathVariables.forEach((variable: string) => {
                    this.updateEnvironmentVariable(variable);
                });
                return {
                    name: `${resource}${route.path}`,
                    request: {
                        method: route.method.toUpperCase(),
                        header: [],
                        body: {
                            mode: 'raw',
                            raw: "{}",
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        },
                        url: {
                            raw: `{{base_url}}/${apiPath}${route.path}`,
                            host: ["{{base_url}}"],
                            path: [...arrApiPath, ...route.path.split('/').filter(Boolean).map((p: string) => {
                                return p.startsWith(':') ? `{{${p.slice(1)}}}` : p;
                            })]
                        },
                        event: [
                            ...isGetOne ? [{
                                listen: "prerequest",
                                script: {
                                    type: "text/javascript",
                                    exec: [
                                        `pm.environment.set('${resource}_id', pm.variables.get('current_id'));`
                                    ]
                                }
                            }] : [],
                            ...isPost ? [{
                                listen: "test",
                                script: {
                                    type: "text/javascript",
                                    // exec: [
                                    //     `pm.environment.set('${resource}_id', pm.response.json(')._id);`  // Establece una variable de entorno después de una operación POST
                                    // ]
                                    exec: [
                                        "pm.test(\"Set environment variable from response\", function () {",
                                        "    var jsonData = pm.response.json();",
                                        "    pm.environment.set(\"crac_id\", jsonData._id);",
                                        "});"
                                    ],
                                }
                            }] : []
                        ]
                        // event: isGetOne ? [{
                        //     listen: "prerequest",
                        //     script: {
                        //         type: "text/javascript",
                        //         exec: [
                        //             `pm.environment.set(':${resource}_id', pm.variables.get('current_id'));`
                        //         ]
                        //     }
                        // }] : []
                    },
                    response: []
                };
            })
        };

        this.collection.items.push(folderItem);
        this.saveCollectionToFile();
        this.saveEnvironmentToFile();
    }
    private updateEnvironmentVariable(key: string) {
        // Verifica si la variable ya existe


        /* eslint-disable-next-line */
        const existingVariable = this.environment.values.find((variable: any) => variable.key === key);
        if (!existingVariable) {
            // Agrega la nueva variable al entorno
            this.environment.values.push({ key, value: null, enabled: true });
        }
    }


    private saveCollectionToFile() {
        try {
            // Guardar la colección en el archivo JSON
            fs.writeFileSync(this.collectionFilePath, JSON.stringify(this.collection, null, 2));
            console.info('Colección de Postman actualizada y guardada correctamente.');
        } catch (error) {
            console.error('Error al guardar la colección de Postman:', error);
        }
    }
    private saveEnvironmentToFile() {
        try {
            // Guardar el entorno en el archivo JSON
            fs.writeFileSync(this.environmentFilePath, JSON.stringify(this.environment, null, 2));
            console.info('Entorno de Postman actualizado y guardado correctamente.');
        } catch (error) {
            console.error('Error al guardar el entorno de Postman:', error);
        }
    }
}


