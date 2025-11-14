        import { Entity, UUIDEntityId } from '@domaincrafters/domain';
        import { Guard } from '@domaincrafters/std';
        import { ExtraGuard, UserProfile } from 'EcoPath/Domain/mod.ts';

        export class UserId extends UUIDEntityId {
            private constructor(id?: string) {
                super(id);
            }

            static create(id?: string): UserId {
                return new UserId(id);
            }
        }

        export class User extends Entity {
            private readonly _name: string;
            private readonly _email: string;
            private readonly _avatarImage: string;
            private readonly _userProfile: UserProfile;

            private constructor(
                id: UserId,
                name: string,
                email: string,
                avatarImage: string,
                userProfile: UserProfile
            ) {
                super(id);
                this._name = name;
                this._email = email;
                this._avatarImage = avatarImage;
                this._userProfile = userProfile;
            }

            public static create(
                id: UserId,
                name: string,
                email: string,
                avatarImage: string,
                userProfile: UserProfile
            ): User {
                const user: User = new User(id, name, email, avatarImage, userProfile);
                user.validateState();
                return user;
            }

            public override validateState(): void {
                Guard.check(this._name, 'name').againstEmpty().againstWhitespace();
                Guard.check(this._email, 'email').againstEmpty().againstWhitespace();
                ExtraGuard.check(this._avatarImage, 'avatarImage').ensureStringIsInBase64Format();
                Guard.check(this._userProfile, 'userProfile').againstNullOrUndefined()
            }

            override get id(): UserId {
                return this._id as UserId;
            }

            get name(): string {
                return this._name;
            }

            get email(): string {
                return this._email;
            }

            get avatarImage(): string {
                return this._avatarImage;
            }

            get userProfile(): UserProfile {
                return this._userProfile;
            }
        }