# Feature: Copy Section from Another Playbook

## Overview

Copy section from another playbook lets an admin reuse an existing section — with all its specs intact — across playbooks without rebuilding it from scratch. The admin picks a source playbook and a section; the section name and all its specs are copied into the current playbook in order. Each copied spec remains linked to its existing library entry, so the full sync mechanism continues to work normally after the copy.

## Complexity Assessment

- **Technical Complexity**: Low — the operation is a read of the source section's spec list followed by a write of new chapter-spec records linking to the same `spec_library_id` values; no new data is created in the library.
- **Design Complexity**: Low — a two-step picker (select playbook → select section) followed by a confirmation; the pattern is a modal with two sequential dropdowns or a simple tree navigator.
- **User Experience Complexity**: Low — the interaction is intuitive; the key point to communicate is that this is a copy (the source section is not moved or affected) and that library links are preserved (sync still works).

## Detailed Description

### Copy Section from Another Playbook

Opens a picker (select playbook → select section); copies the section name and all specs in order into the current playbook. Each copied spec is linked to its existing library entry, so sync still works normally.
