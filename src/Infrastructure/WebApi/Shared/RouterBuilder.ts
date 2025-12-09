import { Router, type RouterMiddleware } from '@oak/oak';
import { IllegalStateException } from '@domaincrafters/std';
import type { HttpMethod } from '@oak/commons/method';
import type { RouteHandler } from 'EcoPath/Infrastructure/WebApi/Shared/Contracts/RouteHandler.ts';

export class RouterBuilder {
    private readonly _router: Router = new Router();
    private _routeHandler: RouteHandler | undefined;

    build(): Router {
        return this._router;
    }

    mapGet(
        routeName: string,
        routePath: string,
        middlewares?: RouterMiddleware<string>[],
    ): this {
        return this.mapRoute('GET', routeName, routePath, middlewares);
    }

    mapPost(
        routeName: string,
        routePath: string,
        middlewares?: RouterMiddleware<string>[],
    ): this {
        this.mapRoute('POST', routeName, routePath, middlewares);

        return this;
    }

    private mapRoute(
        method: HttpMethod,
        routeName: string,
        routePath: string,
        middlewares?: RouterMiddleware<string>[],
    ): this {
        const selectedMiddlewares: RouterMiddleware<string>[] = middlewares || [];

        if (this._routeHandler) {
            selectedMiddlewares.push(this._routeHandler.handle.bind(this._routeHandler));
        }

        if (selectedMiddlewares.length === 0) {
            throw new IllegalStateException(`No route handler for route ${routeName}`);
        }

        this._router.add(
            method,
            routeName,
            routePath,
            ...selectedMiddlewares,
        );

        console.log(`Added route ${method} ${routePath} with name ${routeName}`);
        return this;
    }

    public addRouteHandler(routeHandler: RouteHandler): void {
        this._routeHandler = routeHandler;
    }
}