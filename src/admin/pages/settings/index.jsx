import { Divider } from "primereact/divider"
import SettingsLayout from "./layout";
import {ProfileForm} from "./profile-form";

export default function Settings() {
  return (
    <SettingsLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Divider />
        <ProfileForm />
      </div>
    </SettingsLayout>
  )
}
