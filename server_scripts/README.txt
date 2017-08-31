# DigitalOcean Deploy Scripts

So far, just a few scripts and config files for deploy to DO. I'm planning on using Phoenix Framework but I could accomodate another
as it's all just bash. Ideally this would be run by a simple web gui. Ideally this would be a multi-site server and could run many Phoenix
processes that serve different domains (still unclear about how to achieve that). The deploy would spin up a droplet, set it up, then once
everything is running (website works, db loaded, CNAME data entered, etc), switch a floating IP from the prod box to this one so it becomes
the prod box. Then just to be sure keep the prod box running if you ever want to switch back (or even if the backup prod isn't running, you
could spin up an older version and deploy that to prod, it would just take a few minutes to do the setup).
