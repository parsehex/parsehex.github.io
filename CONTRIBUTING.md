# Contributing to Project Depot Gallery

I welcome contributions!

## Development Workflow

I use a **Dev Branch Workflow**.

1.  **Work on `dev`**
    Make your changes and commit directly to the `dev` branch.
    ```bash
    git checkout dev
    # make changes
    git add .
    git commit -m "Description of changes"
    git push origin dev
    ```

2.  **Release to `main`**
    When you are ready to release the changes to production:
    -   Open a Pull Request from `dev` to `main`.
    -   Ensure the tests pass.
    -   Merge the PR.
