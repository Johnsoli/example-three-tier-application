# Sandbox Check

Verification of the repo layout from inside the working copy.
Commands were run on the working branch `forge/verify-the-repo-layout-from-inside-126fa86b`.

---

## `ls -la`

```
total 24
drwxrwxrwx    5 root     root           137 Aug 13 20:53 .
drwxr-xr-x    1 root     root            17 Aug 13 20:53 ..
drwxr-xr-x    7 node     node           162 Aug 13 20:53 .git
drwxr-xr-x    3 node     node            23 Aug 13 20:53 .github
-rw-r--r--    1 node     node          2165 Aug 13 20:53 .gitignore
-rw-r--r--    1 node     node          1071 Aug 13 20:53 LICENSE
-rw-r--r--    1 node     node          4148 Aug 13 20:53 README.md
-rw-r--r--    1 node     node          3940 Aug 13 20:53 agents.md
-rw-r--r--    1 node     node           981 Aug 13 20:53 docker-compose.yml
drwxr-xr-x    6 node     node            60 Aug 13 20:53 src
```

---

## `git log --oneline -3`

```
88ecaf5 added infra and deployments
```

---

## `node --version`

```
v22.23.2
```
