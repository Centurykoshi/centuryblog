/// <reference types="next" />
/// <reference types="next/image-types/global" />

// SCSS Module declarations
declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.sass' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.module.scss' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.module.sass' {
    const content: Record<string, string>;
    export default content;
}