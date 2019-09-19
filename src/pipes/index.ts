import { AbstractExtEntityPipe } from './abstract';

const pipes = new Map<string, typeof AbstractExtEntityPipe>();

async function pipesFactory(pipe_alias: string): Promise<AbstractExtEntityPipe> {
    let ctor: typeof AbstractExtEntityPipe;
    if (pipes.has(pipe_alias)) {
        ctor = pipes.get(pipe_alias)!;
    } else {
        const pipe_path = `./${pipe_alias}`;
        const module: { default: typeof AbstractExtEntityPipe } = await import(pipe_path);
        pipes.set(pipe_alias, ctor = module.default);
    }
    return new ctor();
}

export { pipesFactory };
