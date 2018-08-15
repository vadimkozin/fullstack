#!/bin/sh
pid=`lsof -i tcp:5000 | grep node | awk '{print $2}'`

if [ -n "$pid" ]
then
    kill -9 $pid && echo "killed $pid" && sleep 1
fi

