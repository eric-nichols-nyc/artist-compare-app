#!/bin/bash
psql -U postgres -c "CREATE EXTENSION IF NOT EXISTS vector;"