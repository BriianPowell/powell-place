#!/bin/sh
# Refresh graphify-out/ in the background with the graphify CLI. No-op when
# graphify is not installed or the graph has never been built in this checkout.

[ "${GRAPHIFY_SKIP_HOOK:-0}" = "1" ] && exit 0
command -v graphify >/dev/null 2>&1 || exit 0
[ -d "${GRAPHIFY_OUT:-graphify-out}" ] || exit 0

GIT_DIR=${GIT_DIR:-$(git rev-parse --git-dir)}
[ -d "$GIT_DIR/rebase-merge" ] && exit 0
[ -d "$GIT_DIR/rebase-apply" ] && exit 0
[ -f "$GIT_DIR/MERGE_HEAD" ] && exit 0
[ -f "$GIT_DIR/CHERRY_PICK_HEAD" ] && exit 0

log="$HOME/.cache/graphify-rebuild.log"
mkdir -p "$(dirname "$log")"
nohup graphify update . </dev/null >>"$log" 2>&1 &
