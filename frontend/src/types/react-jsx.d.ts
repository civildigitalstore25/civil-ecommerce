// Provide a minimal global JSX namespace for third-party type declarations
declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}
