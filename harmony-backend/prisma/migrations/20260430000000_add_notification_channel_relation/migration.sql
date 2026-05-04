-- AddForeignKey — wire notifications.channel_id → channels.id
-- The column already exists; only the FK constraint was missing.
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
